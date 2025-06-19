function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0)
    const count = numbers.length

    return (sum / count)
}

module.exports = calculateAverage;