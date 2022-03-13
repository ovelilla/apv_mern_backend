const isEmpty = (obj) => {
    for (let i in obj) {
        return false;
    }
    
    return true;
}

export default isEmpty;
