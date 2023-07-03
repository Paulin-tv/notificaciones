const authUser = (permissions) => {
    return (req, res, next) => {
        const userRole = req.body.role
        if (permissions.includes(userRole)){
            next()
        } else {
            return res.status(401).json("Insufficient permits.")
        };
    };
};

module.exports = {authUser}