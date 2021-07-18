import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import './App.css';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Slider from '@material-ui/core/Slider';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIcon from '@material-ui/icons/Assignment';

function App() {
  const classes = useStyles();
  const [resultText, setResultText] = useState('');
  const [currentstyle, setCurrentstyle] = useState('progress-bar-info');
  const progressstyle = `progress-bar ${currentstyle}`
  const [length, setLength] = useState(6);
  const [strength, setStrength] = useState('low');
  const location = useLocation();

  const [status, setStatus] = useState({
    boolLower : true,
    boolNum: true,
    boolSign: false,
    boolUpper: true
  });

  useEffect(() => {
    axios({
      method: `POST`,
      url:`https://password.hawaiian-pizza.pw/password/generate`,
      data:{
        boolLower : true,
        boolNum: true,
        boolSign: false,
        boolUpper: true,
        passwordLength: 6
      }
    }).then((response) => {
        setResultText(response.data);
    }).catch((error) => {
        console.log(error);
    });
  }, [location]);

  const handleChange = (event) => {
    setStrength(event.target.value);

    if(event.target.value === 'high'){
      if(length < 12){
        setLength(12);
        setCurrentstyle('progress-bar-success');
      }
      setStatus({
        boolLower: true,
        boolNum: true,
        boolSign: true,
        boolUpper: true
      });
    }else if(event.target.value === 'middle'){
      setStatus({
        boolLower: true,
        boolNum: true,
        boolSign: true,
        boolUpper: false
      });
    }else{
      setStatus({
        boolLower: true,
        boolNum: true,
        boolSign: false,
        boolUpper: false
      });
    }
  };

  const onClickEvent = () => {
    axios({
      method: 'POST',
      url:`https://password.hawaiian-pizza.pw/password/generate`,
      data: {
        boolLower: status.boolLower,
        boolNum: status.boolNum,
        boolSign: status.boolSign,
        boolUpper: status.boolUpper,
        passwordLength: length
      }
    }).then((response)=>{
      setResultText(response.data);
    }).catch((error)=>{
      console.log(error);
    });
  };

  const lengthChange = (e) => {
    if(strength === 'high' && Number(e.target.value)< 12){
      setLength(12);
    }else{
      setLength(Number(e.target.value));
    }

    if(strength !== 'high'){
      if(Number(e.target.value) < 3){
        setCurrentstyle('progress-bar-danger');
      }else if(Number(e.target.value) < 6){
        setCurrentstyle('progress-bar-warning');
      }else if(Number(e.target.value) < 9){
        setCurrentstyle('progress-bar-info');
      }else{
        setCurrentstyle('progress-bar-success');
      }
    }

    
  }

  return (
    <div className="App">
      
      <div className="container">
        <Paper className="paper" elevation={3}>
          <div className="result-box">
          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <OutlinedInput
            value={resultText}
            className={classes.input}
          />
        </FormControl>
        <CopyToClipboard text={resultText}>
            <IconButton
              className={classes.linkBtn}
              onClick={() => {
                alert('클립보드에 패스워드가 복사되었습니다.');
              }}
            >
              <AssignmentIcon />
            </IconButton>
          </CopyToClipboard>
          </div>
          <div className="progress">
            <div 
            className={progressstyle} 
            role="progressbar" 
            aria-valuenow="60" 
            aria-valuemin="0" 
            aria-valuemax="100" 
            style={{ 
              minWidth: "10%",
              maxWidth: "100%",
              width: length*8.5+"%"
              }}>
              
            </div>
          </div>
        </Paper>
        <Paper className="paper-custom" elevation={3}>
          <h3>비밀번호 생성기</h3>
          <hr className="line"/>
          <div className="length-box">
            <span className="title">비밀번호 길이</span>
            <FormControl className={clsx(classes.margin, classes.textField2)} variant="outlined">
              <OutlinedInput
              value={length}
              className={classes.input}
              onChange={lengthChange}
              />
            </FormControl>
            <PrettoSlider 
            valueLabelDisplay="auto" 
            aria-label="pretto slider" 
            defaultValue={5} 
            value={length} 
            max={50} 
            onChange={(event, v)=>{
              if(strength === 'high' && v < 12){
                setLength(12);
              }else{
                setLength(v);
              }
              if(strength !== 'high'){
                if(v < 3){
                setCurrentstyle('progress-bar-danger');
              }else if(v < 6){
                setCurrentstyle('progress-bar-warning');
              }else if(v < 9){
                setCurrentstyle('progress-bar-info');
              }else{
                setCurrentstyle('progress-bar-success');
              }
              }
              
            }}/>
              
          </div>
          <div className="status-box">
          <FormControl component="fieldset">
      
      <RadioGroup aria-label="gender" name="gender1" value={strength} onChange={handleChange} className={classes.radiolabel}>
        <FormControlLabel value="high" control={<Radio color="primary" className={classes.radiobtn}/>} label="강도 높음 (대문자,소문자, 숫자, 기호, 12자 이상)" />
        <FormControlLabel value="middle" control={<Radio color="primary" className={classes.radiobtn}/>} label="강도 중간 (소문자,숫자,기호)" />
        <FormControlLabel value="low" control={<Radio color="primary" className={classes.radiobtn}/>} label="강도 낮음 (소문자,숫자)" />
      </RadioGroup>
    </FormControl>
    
          </div>
          <button className="password_button" onClick={onClickEvent}>비밀번호 생성</button>
        </Paper>
      </div>

    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: '92%',
    '@media(max-width: 949px)': {
      width: '85%',
    }
  },
  textField2: {
    width: '10ch',
  },
  input: {
    fontSize: '0.5em',
    fontWeight: '700',
    "& .MuiOutlinedInput-input":{
      textAlign: 'center',
      fontFamily: 'Lexend Mega, sans-serif',
      letterSpacing: '-1px',
    }
    
  },
  radiobtn:{
    "& .MuiSvgIcon-root":{
      width: '1.5em',
      height: '1.5em'
    },
  },
  radiolabel:{
    "& .MuiTypography-body1":{
      fontSize: '1.5rem',
    }
  },
  linkBtn:{
    margin: '10px 4px 0px',
    "& .MuiSvgIcon-root":{
      fontSize: "29px",
      lineHeight: "65px",
    },
    '@media(max-width: 949px)': {
      verticalAlign: "middle",
      marginTop: "18px",
      margin: '0px 1%',
      padding: '1%',
      "& .MuiSvgIcon-root":{
        fontSize: "min(20px, 7vw)",
      },
    }
    
  }
}));

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  
})(Slider);