document.addEventListener('DOMContentLoaded', () => {
  const enterBtn = document.getElementById('enter-btn');
  const landingScreen = document.getElementById('landing-screen');
  const appScreen = document.getElementById('app-screen');
  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const chatOutput = document.getElementById('chat-output');

  // 1. Enter Button Click Handler
  if (enterBtn) {
    enterBtn.addEventListener('click', async (e) => {
      e.preventDefault(); // Prevents default link/button reload

      try {
        // Transition UI immediately
        if (landingScreen && appScreen) {
          landingScreen.classList.add('hidden');
          appScreen.classList.remove('hidden');
        }

        // Send request to Vercel API endpoint
        const response = await fetch('/api/companion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'Hello' })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          return;
        }

        const data = await response.json();
        console.log('Companion initialized:', data);

      } catch (err) {
        console.error('Network or execution error:', err);
      }
    });
  }

  // 2. Chat Send Handler
  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const promptText = userInput.value.trim();
      if (!promptText) return;

      appendMessage('user', promptText);
      userInput.value = '';

      try {
        const response = await fetch('/api/companion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          appendMessage('system', `Error: ${errJson.error || 'Server error'}`);
          return;
        }

        const data = await response.json();
        appendMessage('bot', data.reply);

      } catch (err) {
        console.error('Chat error:', err);
        appendMessage('system', 'Connection lost. Please try again.');
      }
    });
  }

  function appendMessage(role, text) {
    if (!chatOutput) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;
    msgDiv.textContent = text;
    chatOutput.appendChild(msgDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }
});
