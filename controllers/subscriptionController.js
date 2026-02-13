import Razorpay from "razorpay";
import Subscription from "../models/subscriptionModel.js";

const rzpInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createSubscription = async (req, res, next) => {
  try {
    console.log(req.body);
    const newSubscription = await rzpInstance.subscriptions.create({
      plan_id: req.body.planId,
      total_count: 120,
      notes: {
        userId: req.user._Id, //here it will automatically convert to string
      },
    });
    // console.log(newSubscription);
    const subscription = new Subscription({
      razorpaySubscriptionId: newSubscription.id,
      userId: req.user._id,
    });
    await subscription.save();
    console.log(subscription);
    res.json({ subscriptionId: newSubscription.id });
  } catch (err) {
    console.log("createSubscription")
    console.log(err);
    next(err);
  }
};
