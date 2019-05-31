const fs = require('fs')
const code = fs.readFileSync('code.subleq').toString().split('\n').join(' ').split(' ')
var mem = code.filter((val, i, arr) => {
    return /^[\d\.-]+$/.test(val)
}).map(x => +x)
mem[-1] = 0
mem[-2] = 0
mem[-3] = 0
mem[-4] = 0
mem[-5] = 0
mem[-6] = 0
var iptr = 0

const interval = setInterval(() => {
    if (iptr < 0) {
        switch (iptr) {
            case -1:
                process.exit(mem[-2])
                break
            case -3:
                console.log(mem[-5])
                iptr = mem[-6]
                mem[-5] = 0
                mem[-6] = 0
                break
            case -4:
                console.error(mem[-5])
                iptr = mem[-6]
                mem[-5] = 0
                mem[-6] = 0
                break
            default:
                err(`invalid instruction pointer. jumped to ${iptr}.`)
                break
        }
    } else {
        var aptr = mem[iptr + 1],
            bptr = mem[iptr + 0],
            tgt = mem[iptr + 2]
        if (mem[aptr] === undefined)
            mem[aptr] = 0
        if (mem[bptr] === undefined)
            mem[bptr] = 0
        if (mem[tgt] === undefined)
            mem[tgt] = 0

        var a = mem[aptr],
            b = mem[bptr],
            result = a - b
        mem[aptr] = result
        if (result <= 0) iptr = tgt
        else iptr += 3
    }
}, 10)

function err(...msg) {
    console.error(...msg)
    process.exit(-999)
}