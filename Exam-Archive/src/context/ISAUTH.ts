function hasKnoxToken() {
    const token = localStorage.getItem('authToken') || 
                    sessionStorage.getItem('authToken');
    return !!token;
}

export default hasKnoxToken;