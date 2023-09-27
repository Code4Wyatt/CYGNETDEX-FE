async function createXummSwap(destinationWithMaybeTag, amount) {
    const [destination, destinationTag] = destinationWithMaybeTag.split("#");
    console.log('createXummSwap params', {destination, amount, destinationTag})
    
    try {
      const response = await fetch('http://localhost:3001/xumm/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destination: destination,
          destinationTag: destinationTag ? parseInt(destinationTag, 10) : undefined,
          amount: amount
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to create swap.');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating swap:', error);
      throw error; // You can choose to throw the error, so you can handle it where you call the function.
    }
}
  
export default createXummSwap;
