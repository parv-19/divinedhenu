import { deleteFromCloudinary, uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

const CLOUDINARY_FOLDER = 'divinedhenu';

export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Image file is required');
    }

    const image = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);

    res.status(201).json({
      success: true,
      image,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('At least one image file is required');
    }

    const images = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer, CLOUDINARY_FOLDER))
    );

    res.status(201).json({
      success: true,
      images,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUploadedImage = async (req, res, next) => {
  try {
    const publicId = req.params.publicId || req.body?.publicId;

    if (!publicId) {
      res.status(400);
      throw new Error('Cloudinary publicId is required');
    }

    const result = await deleteFromCloudinary(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};
