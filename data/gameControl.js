function calculateBullsAndCows(secret, guess){
    const dict = new Map()
    for (let i = 0; i < secret.length; i++) {
        dict.set(secret[i], 1 + (dict.has(secret[i]) ? dict.get(secret[i]) : 0))
    }
    let [b, c] = [0, 0]
    guess.split('').forEach((x, i) => {
        if (x === secret[i]) {
            b++
        }
        if (dict.has(x) && 0 < dict.get(x)) {
            dict.set(x, dict.get(x) - 1)
            c++
        }
    })
    console.log(b)
}

module.exports = { calculateBullsAndCows }