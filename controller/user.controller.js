

exports.testRoute = (async (_req, res, next) => {
    try {
        res.status(201).json({
            success: true,
            message: "Route working succesfully test - 2",
        });
    } catch (error) {
        console.log(error)
    }
})