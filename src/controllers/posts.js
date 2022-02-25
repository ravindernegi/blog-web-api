const PostModel = require('../models/post');
const connectToDatabase = require('../helpers/db');
const { pageMeta } = require('../helpers/common');

// Get all posts
const getAllPost = async (req, res, next) => {
  const dbCon = await connectToDatabase();
  try {
    let query = {};
    query.is_deleted = false;

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let start = (page - 1) * limit;
    if (req.params.search) {
      query['$or'] = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { first_name: { $regex: req.query.search, $options: 'i' } },
        { last_name: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const list = await PostModel.aggregate([
      { $match: query },
      { $skip: start },
      { $limit: limit },
      {
        $sort: {
          title: 1,
        },
      },
    ]).exec();
    let total = await PostModel.countDocuments(query);
    let page_meta = await pageMeta(total, page, limit);
    return res.send({ status: true, data: { list: list, meta: page_meta } });
  } catch (error) {
    dbCon.close();
    next(error);
  }
};

// Get by post iD
const getPostById = async (req, res, next) => {
  const dbCon = await connectToDatabase();
  try {
    let rules = {
      id: 'required',
    };
    const isValid = validate(req.params, rules, res);
    if (isValid) {
      return isValid;
    }
    PostModel.findById(req.params.id)
      .then((item) => res.send(item))
      .then(() => {
        dbCon.close();
      })
      .catch((err) => {
        dbCon.close();
        next(err);
      });
  } catch (error) {
    dbCon.close();
    next(error);
  }
};

module.exports = {
  getAllPost,
  getPostById,
};
