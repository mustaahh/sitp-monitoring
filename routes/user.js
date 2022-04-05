const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const { upload } = require("../multer.js");

const router = require("express").Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// GET ALL USER
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE USER
router.put(
  "/:id",

  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(422).json("Invalid Id");
    } else {
      try {
        let updatedHashedPass;
        const user = await User.findById(req.params.id);
        !user && res.status(404).json("Account Not Found");
        if (req.body.password) {
          const genSalt = await bcrypt.genSalt(10);
          updatedHashedPass = await bcrypt.hash(req.body.password, genSalt);
        }
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: { ...req.body, password: updatedHashedPass },
          },
          { new: true }
        );

        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
);

// UPLOAD PROFILE PIC
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.profilePic.length) {
      cloudinary.uploader.destroy(user.profilePic[0].picId, (error, result) => {
        if (error) res.status(500).json({ message: error });
      });
    }
    cloudinary.uploader.upload(
      req.file.path,
      { folder: "sitp/profile_pic" },
      (error, result) => {
        if (error) res.status(500).json({ message: error });
        else
          res.status(200).json({
            picId: result.public_id,
            url: result.secure_url,
          });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    try {
      const deletedUser = await User.findByIdAndRemove(req.params.id);

      res.status(200).json(`User ${deletedUser.nama} Berhasil Dihapus`);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(422).json("Invalid Id");
  }
});

router.get("/search/:keyword", async (req, res) => {
  try {
    const users = await User.find({
      nama: { $regex: req.params.keyword, $options: "i" },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER STATS
router.get("/stats", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE USER PENGALAMAN
router.delete("/pengalaman/:tahun", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).json("Pengalaman Berhasil Dihapus");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
