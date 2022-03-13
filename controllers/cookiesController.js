const setCookie = (req, res) => {
    const { name, value } = req.body;

    res.cookie(name, value, {
        expires: new Date(Date.now() + 24 * 3600000),
        secure: true,
        httpOnly: true,
        sameSite: 'Lax'
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
