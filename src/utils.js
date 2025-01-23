const fs = require('fs')

// 读取本地存储的状态
function readLastState() {
    try {
        const data = fs.readFileSync('lastState.json')
        return JSON.parse(data)
    } catch (error) {
        return null
    }
}

// 保存当前的状态
function saveCurrentState(currUrl, state) {
    const lastState = readLastState()
    const saveState = {
        ...lastState,
        [currUrl]: state
    }
    fs.writeFileSync('./lastState.json', JSON.stringify(saveState, null, 2))
}

// 检查状态
const checkFlag = (flag, resolve) => {
    const id = setInterval(() => {
        if (flag === true) {
            clearInterval(id)
            resolve()
        }
    }, 1000)
}

const checkUpdate = (newState, lastState) => {
    let isUpdated = false;
    if (newState == null && lastState || newState && lastState == null) {
        console.log(1)
        isUpdated = true
    } else if (Object.keys(newState).length !== Object.keys(lastState).length) {
        console.log(2)
        console.log(Object.keys(newState).length, Object.keys(lastState).length)
        isUpdated = true;
    } else {
        for (let key in newState) {
            if (newState.hasOwnProperty(key)) {
                if (lastState[key] === undefined || newState[key] !== lastState[key]) {
                    isUpdated = true;
                    console.log(key)
                    break;
                }
            }
        }
    }

    if (!isUpdated) {
        console.log('No new items detected.');
        return false;
    }
    return true;
}

module.exports = {
    readLastState,
    saveCurrentState,
    checkFlag,
    checkUpdate
};