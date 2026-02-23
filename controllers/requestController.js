import Request from "../models/Request.js";

export const createRequest = async (req, res) => {
  try {
    const request = await Request.create(req.body);
    res.json(request);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getRequests = async (req, res) => {
  const requests = await Request.find()
    .populate("fromUser", "name")
    .populate("toUser", "name");

  res.json(requests);
};

export const updateStatus = async (req, res) => {
  const request = await Request.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(request);
};
