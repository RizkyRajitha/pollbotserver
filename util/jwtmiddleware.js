const jwt = require("jsonwebtoken");

const jwtMiddlware = (request, reply, done) => {
  try {
    // console.log(request.headers);
    let data = jwt.verify(
      request.headers.authorization,
      process.env.SUPABASE_JWT_SECRET
    );
    request.locals = data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
  done();
};

module.exports = jwtMiddlware;
