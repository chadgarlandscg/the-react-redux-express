module.exports.increment = value => ++value
module.exports.decrement = value => --value
module.exports.change = (toBeDecremented, value) => toBeDecremented ? this.decrement(value) : this.increment(value)