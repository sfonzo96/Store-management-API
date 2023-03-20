const checkPermission = (permission) => (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.role === 'admin') {
        return next();
    }

    if (
        user.role === 'user' &&
        (permission === 'sendMessage' ||
            permission === 'addToCart' ||
            permission === 'deleteFromCart' ||
            permission === 'makePurchase')
    ) {
        return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
};

export default checkPermission;
