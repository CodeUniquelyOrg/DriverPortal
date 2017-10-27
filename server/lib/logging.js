export const log = (req, res, next) => {
  console.log('ROUTE INDEX URL is ', req.url); // eslint-disable-line no-console
  next();
};
