/**
 * This script validates the two-way binding functionality in the browser demo
 * It should be run in the browser console after loading the browser-demo.html
 */

function validateTwoWayBinding() {
  console.log('Validating two-way binding...');
  
  // Get references to DOM elements
  const counter1Value = document.querySelector('#counter-1 .counter-value');
  const counter1Input = document.getElementById('direct-input-1');
  const counter2Value = document.querySelector('#counter-2 .counter-value');
  const counter2Input = document.getElementById('direct-input-2');
  
  // Step 1: Test that UI updates reflect in the input (binding → UI)
  console.log('1. Testing binding → UI synchronization');
  
  // Initial values
  const initialCount1 = parseInt(counter1Value.textContent, 10);
  const initialInput1 = parseInt(counter1Input.value, 10);
  
  console.log(`Counter 1: Display = ${initialCount1}, Input = ${initialInput1}`);
  if (initialCount1 === initialInput1) {
    console.log('✅ Initial values are synchronized');
  } else {
    console.error('❌ Initial values are not synchronized');
  }
  
  // Click the increment button to change the binding
  document.getElementById('increment-1').click();
  
  // Check if input updated
  setTimeout(() => {
    const newCount1 = parseInt(counter1Value.textContent, 10);
    const newInput1 = parseInt(counter1Input.value, 10);
    
    console.log(`After increment: Display = ${newCount1}, Input = ${newInput1}`);
    if (newCount1 === newInput1) {
      console.log('✅ Values updated correctly after increment');
    } else {
      console.error('❌ Input did not update when binding changed');
    }
    
    // Step 2: Test that input changes update the binding (UI → binding)
    console.log('\n2. Testing UI → binding synchronization');
    
    // Set a new value in the input
    const testValue = newInput1 + 10;
    counter1Input.value = testValue;
    
    // Trigger the input event
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    counter1Input.dispatchEvent(event);
    
    // Check if display updated
    setTimeout(() => {
      const finalCount1 = parseInt(counter1Value.textContent, 10);
      
      console.log(`After input change: Display = ${finalCount1}, Input = ${testValue}`);
      if (finalCount1 === testValue) {
        console.log('✅ Display updated correctly after input change');
      } else {
        console.error('❌ Display did not update when input changed');
      }
      
      // Final evaluation
      console.log('\nTWO-WAY BINDING VALIDATION COMPLETE:');
      if (initialCount1 === initialInput1 && 
          newCount1 === newInput1 && 
          finalCount1 === testValue) {
        console.log('✅ Two-way binding is functioning correctly!');
      } else {
        console.error('❌ Two-way binding has issues!');
      }
    }, 100);
    
  }, 100);
}

// Run the validation
validateTwoWayBinding();
