const cathAsync = require("../utils/cathAsync");
const Tour = require("../model/tourSchema")
const stripe = require('stripe')(process.env.STRIPE_SECRETKEY)



exports.paymentTour = cathAsync(async (req, res, next) => {
    // find tour with params id 
    const tour = await Tour.findById(req.params.tourId)
  
    // create checkout sessions
    const session = await stripe.checkout.sessions.create({
        // Payment Information
        payment_method_types: ['cards'],
        success_url: `${req.protocol}://${req.get('host')}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/:id`,
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

        ]
    })
    console.log(session_id);
    console.log(session);

    res.status(200).json({
        status:"success",
        data : session
    })
})