import './App.css';
import {useState,useEffect} from 'react';
import { tenureData } from './utils/constants';
import { numberWithCommas } from './utils/config';
import TextInput from './components/text-input';
import SliderInput from './components/slider-input';

function App() {
  const [cost , setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);


  // calculate emi
  const calculateEMI = (downpayment) => {
    //Emi amount = [P * R * (1+R)^N] /[(1+R)^N-1]
    if(!cost) return ;

    const loanAmt = cost - downpayment;
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;

    const EMI = (loanAmt * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
                ((1 + rateOfInterest) ** numOfYears - 1);
    
    return Number(EMI / 12).toFixed(0);
  };


  // update emi when downpayment is change  using slider
  const updateEMI = (e) => {
    if(!cost)
      return;
    
    const dp = Number(e.target.value);
    setDownPayment(dp.toFixed(0));
    //Calculate EMI and update it

    const emi = calculateEMI(dp);
    setEmi(emi);
  };


  // update downpayment when emi is change using slider
  const updateDownPayment = (e) => {
    if(!cost) return;

    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));
    //Calculate Dp and Update it

    const dp = calculateDp(emi);
    setDownPayment(dp);
  };

  // calculate downpayment
  const calculateDp = (emi) => {
    if(!cost) return;

    const downPaymentPercent = 100 - (emi / calculateEMI(0) * 100);
    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  };
  

  useEffect(() => {
    if(!(cost>0)){
      setDownPayment(0);
      setEmi(0);
    }

    const emi = calculateEMI(downPayment);
    setEmi(emi);
  },[tenure,cost]);


  // calculate totaldownpayment
  const totalDownPayment = () => {
    return numberWithCommas(
      (Number(downPayment) + (cost - downPayment) * (fee / 100)).toFixed(0)
    );
  };

  // calculate totalemi
  const totalEMI = () => {
    return numberWithCommas((emi * tenure).toFixed(0));
  };

  return (
    <div className="App">
      <span className='title'>EMI Calculator</span>

      <TextInput 
        title = {"Total Cost of Asset"}
        state = {cost}
        setState={setCost}
      />

      <TextInput 
        title = {"Interest Rate (in %)"}
        state = {interest}
        setState={setInterest}
      />

      <TextInput 
        title = {"Processing Fee (in %)"}
        state = {fee}
        setState={setFee}
      />

      <SliderInput
         title="Down Payment"
         underlineTitle={`Total Down Payment - ${totalDownPayment()}`}
         onChange={updateEMI}
         state={downPayment}
         min={0}
         max={cost}
         labelMin={"0%"}
         labelMax={"100%"}
      />

      <SliderInput
         title="Loan per Month"
         underlineTitle={`Total Loan Amount - ${totalEMI()}`}
         onChange={updateDownPayment}
         state={emi}
         min={calculateEMI(cost)}
         max={calculateEMI(0)}
      />
      

      <span className="title">Tenure</span>
      <div className='tenureContainer'>

      {tenureData.map((t) => {
        return (

          <button className= {`tenure ${t === tenure ? "selected" : ""}`} 
          onClick={() => setTenure(t)}>
          {t}
          </button>
          );
      })}
      </div>

    </div>
  );
}

export default App;
