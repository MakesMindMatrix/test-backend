

exports.testRoute = (async (_req, res, next) => {
    try {
        res.status(201).json({
            success: true,
            message: "Route working succesfully",
        });
    } catch (error) {
        console.log(error)
    }
})