document.addEventListener('DOMContentLoaded', () => {
    const instructionInput = document.getElementById('instruction');
    const executeButton = document.getElementById('executeButton');
    const resultDiv = document.getElementById('result');

    executeButton.addEventListener('click', async () => {
        const instruction = instructionInput.value.trim();

        if (!instruction) {
            alert("Please enter an instruction.");
            return;
        }

        resultDiv.textContent = 'Executing...'; // Show loading message

        try {
            const response = await fetch('http://localhost:8000/execute-instruction', { // Adjust URL as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ instruction: instruction })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }
                
            const data = await response.json();
            resultDiv.textContent = data.result;

        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
        }
    });
});