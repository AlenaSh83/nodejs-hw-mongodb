const errorHandler = (err, req, res, next) => {

  const status = err.status || 500;
  
  
  if (req.log) {
    req.log.error({
      message: err.message,
      stack: err.stack,
    });
  }

  
  res.status(status).json({
    status: status,
    message: status === 500 ? 'Something went wrong' : err.message,
    data: err.message,
  });
};

export default errorHandler;