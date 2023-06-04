module.exports.setFlash = (req, res, next) => {
  //we will just find the flash from the req and set to the locals of the response
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
  };
  next();
};
