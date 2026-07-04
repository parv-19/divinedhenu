import multer from 'multer';

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Image file size cannot exceed 5MB'
      : err.message;

    res.status(400).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid resource id',
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: Object.values(err.errors)[0]?.message || 'Please check the submitted details',
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
    return;
  }

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
