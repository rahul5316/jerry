document.addEventListener('DOMContentLoaded', () => {
  const intensityManager = new IntensityManager();
  const visualization = document.getElementById('visualization');
  let historyLog = ''; 

  document.getElementById('addBtn').addEventListener('click', () => {
    const from = parseInt(document.getElementById('from').value, 10);
    const to = parseInt(document.getElementById('to').value, 10);
    const amount = parseInt(document.getElementById('amount').value, 10);
    try {
      const segments = intensityManager.add(from, to, amount);
      appendToHistoryLog(`Add ${amount} from ${from} to ${to}: `, segments);
      updateVisualization();
    } catch (error) {
      alert(error.message);
    }
    clearInputFields();
  });

  document.getElementById('clearBtn2').addEventListener('click', () => {
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('amount').value = '';
  });

  document.getElementById('setBtn').addEventListener('click', () => {
    const from = parseInt(document.getElementById('from').value, 10);
    const to = parseInt(document.getElementById('to').value, 10);
    const amount = parseInt(document.getElementById('amount').value, 10);
    try {
      const segments = intensityManager.set(from, to, amount);
      appendToHistoryLog(`Set ${amount} from ${from} to ${to}: `, segments);
      updateVisualization();
    } catch (error) {
      alert(error.message);
    }
    clearInputFields();
  });

  document.getElementById('clearBtn1').addEventListener('click', () => {
    historyLog = '';
    intensityManager.clear(); 
    updateVisualization();
  });

  document.getElementById('finalResultBtn').addEventListener('click', () => {
    const finalSegments = intensityManager.getSegments();
    visualization.innerHTML = `<pre>Final segments: ${JSON.stringify(finalSegments)}</pre>`;
  });

  function appendToHistoryLog(actionDescription, segments) {
    const formattedSegments = JSON.stringify(segments);
    historyLog += `${actionDescription} ${formattedSegments} <br>`;
  }

  function updateVisualization() {
    visualization.innerHTML = `<pre>${historyLog}</pre>`;
  }
});