const fs = require('fs')
const code = fs.readFileSync('code.subleq').toString().split('\n').join(' ').split(' ')
var mem = code.filter((val, i, arr) => {
    return /^[\d\.-]+$/.test(val)
}).map(x => +x)
var negmem = [0, 0, 0, 0, 0, 0]
var iptr = 0

const interval = setInterval(() => {
    if (iptr < 0) {
        switch (iptr) {
            case -1:
                process.exit(negmem[1])
                break
            case -3:
                console.log(negmem[4])
                iptr = negmem[5]
                break
            case -4:
                console.error(negmem[4])
                iptr = negmem[5]
                break
            default:
                err(`invalid instruction pointer. jumped to ${iptr}.`)
                break
        }
    } else {
        var aptr = mem[iptr + 1],
            bptr = mem[iptr + 0],
            tgt = mem[iptr + 2]
        if (!mem[aptr])
            mem[aptr] = 0
        if (!mem[bptr])
            mem[bptr] = 0
        if (!mem[tgt])
            mem[tgt] = 0
        if (aptr >= 0 && bptr >= 0) {
            var a = mem[aptr],
                b = mem[bptr],
                result = a - b
            mem[aptr] = result
            if (result <= 0) iptr = tgt
            else iptr += 3
        } else if (aptr >= 0 && bptr < 0) {
            var a = mem[aptr],
                b = negmem[Math.abs(bptr) - 1],
                result = a - b
            mem[aptr] = result
            if (result <= 0) iptr = tgt
            else iptr += 3
        } else if (aptr < 0 && bptr >= 0) {
            var a = negmem[Math.abs(aptr) - 1],
                b = mem[bptr],
                result = a - b
            negmem[Math.abs(aptr) - 1] = result
            if (result <= 0) iptr = tgt
            else iptr += 3
        } else if (aptr < 0 && bptr < 0) {
            var a = negmem[Math.abs(aptr) - 1],
                b = negmem[Math.abs(bptr) - 1],
                result = a - b
            negmem[Math.abs(aptr) - 1] = result
            if (result <= 0) iptr = tgt
            else iptr += 3
        }
    }
}, 1000)

function err(...msg) {
    console.error(...msg)
    process.exit(-999)
}