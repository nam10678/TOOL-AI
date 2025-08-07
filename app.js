let results = [];
let model;

async function loadModel() {
    try {
        model = await tf.loadLayersModel('model/model.json');
        console.log("Model loaded.");
    } catch (e) {
        console.error("Failed to load model:", e);
    }
}

loadModel();

function addResult(result) {
    if (!model) {
        alert("Model not loaded yet.");
        return;
    }

    results.push(result);
    if (results.length > 5) results.shift();

    if (results.length === 5) {
        const encoded = results.map(r => {
            if (r === 'P') return 0;
            if (r === 'B') return 1;
            return 2;
        });

        const input = tf.tensor2d([encoded]);
        const prediction = model.predict(input);
        prediction.array().then(arr => {
            const [p, b, t] = arr[0];
            let predicted = '';
            let color = '';
            if (p > b && p > t) {
                predicted = 'Player (P)';
                color = 'blue';
            } else if (b > p && b > t) {
                predicted = 'Banker (B)';
                color = 'red';
            } else {
                predicted = 'Tie (T)';
                color = 'gray';
            }
            document.getElementById("prediction").innerHTML =
                `<span style="color:${color}">Dự đoán: ${predicted}</span><br>
                Độ tin cậy: ${(Math.max(p, b, t) * 100).toFixed(2)}%`;
        });
    }
}

function resetHistory() {
    results = [];
    document.getElementById("prediction").innerHTML = '';
}
