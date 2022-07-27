const setCookie = (req, res) => {
    const { name, value } = req.body;

    res.cookie(name, value, {
        expires: new Date(Date.now() + 24 * 3600000),
        sameSite: "none",
        secure: true,
        // httpOnly: true,
        // sameSite: "Strict",
        // domain: process.env.FRONTEND_URL
    }).send();
}

const getCookie = (req, res) => {
    const { cookie } = req.body;

    res.json({[cookie]: req.cookies[cookie]});
}

const deleteCookie = (req, res) => {
    const { cookie } = req.body;

    res.clearCookie(cookie).send();
}

export { setCookie, getCookie, deleteCookie }
