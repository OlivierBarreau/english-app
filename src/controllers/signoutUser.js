const signoutUser = async (req, res) => { 
    // Destroy the session and redirect to sign-in page
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal server error');
        }
        res.redirect('/signin');
    });
};

module.exports = signoutUser;