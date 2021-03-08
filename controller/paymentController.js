const cathAsync = require("../utils/cathAsync");
const Tour = require("../model/tourSchema")
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.paymentTour = cathAsync(async (req, res, next) => {
    // find tour with params id 
    const tour = await Tour.findById(req.params.tourId)
    
    // create checkout sessions
     var session = await Stripe.checkout.sessions.create({
        // Payment Information
        payment_method_types: ["cards"],
        success_url: `${req.protocol}://${req.get('host')}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.id}`,
        customer_email: req.user.email,
        client_refrence_id: req.params.tourId,
        // Product Information
        line_items: [{
                name: `${tour.name} Tour`,
                description: tour.summary,
                // images works when website is daynamic
                images: [`https://natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1
            }

        ],
    })
    
    
    res.status(200).json({
        status: "success",
        session
    })
})