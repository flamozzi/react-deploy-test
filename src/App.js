import './App.css';
import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';

const App = () => {
  // const [getter, setter] = ...
  const [expenses, setExpenses] = useState([
    { id: 1, charge: '렌트비', amount: 2000 },
    { id: 2, charge: '교통비', amount: 400 },
    { id: 3, charge: '식비', amount: 1200 },
  ]);

  const [charge, setCharge] = useState('');
  const [amount, setAmount] = useState(0);

  const [edit, setEdit] = useState(false);
  const [id, setId] = useState('');

  const [alert, setAlert] = useState({ show: false, type: '', text: '' });

  const clearItems = () => {
    setExpenses([]);
  };

  const handleEdit = (id) => {
    const expense = expenses.find((item) => item.id === id);
    const { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setAlert({ show: false, type: '', text: '' });
    }, 5000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (charge !== '' || amount > 0) {
      if (edit) {
        const newExpenses = expenses.map((item) => {
          // ...item으로 일단 다 복사한 후,
          // charge: charge, amount: amount로 값 수정 (축약으로 charge, amount로 씀)
          return item.id === id ? { ...item, charge, amount } : item;
        });

        setExpenses(newExpenses);

        setEdit(false);
        handleAlert({ type: 'success', text: '아이템이 수정되었습니다.' });
      } else {
        // expenses state에 새로운 객체 만들어서 추가해주기, state update
        // state update 할 때는 항상 불변성을 지켜줘야 한다.
        // 불변성을 지킨다는 말은 이전에 있던 값을 건드리지 X, 새로운 객체 생성

        const newExpense = {
          id: crypto.randomUUID(),
          charge,
          amount,
        };

        setExpenses([...expenses, newExpense]);

        handleAlert({ type: 'success', text: '아이템이 생성되었습니다.' });
      }
    } else {
      console.log('charge or amount is empty');
      handleAlert({
        type: 'danger',
        text: 'charge는 빈 값일 수 없으며, amount는 0보다 커야 합니다.',
      });
    }

    setCharge('');
    setAmount(0);
  };

  const handleCharge = (event) => {
    setCharge(event.target.value);
  };

  const handleAmount = (event) => {
    setAmount(event.target.valueAsNumber);
  };

  const handleDelete = (id) => {
    const newExpenses = expenses.filter((expense) => expense.id !== id);

    setExpenses(newExpenses);
  };

  return (
    <main className="main-container">
      {alert.show ? <Alert type={alert.type} text={alert.text} /> : null}

      <h1>예산 계산기</h1>

      <div style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}>
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
      </div>

      <div style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}>
        <ExpenseList
          handleEdit={handleEdit}
          expenses={expenses}
          handleDelete={handleDelete}
          clearItems={clearItems}
        />
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'end', marginTop: '1rem' }}
      >
        <p style={{ fontSize: '2rem' }}>
          총지출:
          <span>
            {expenses.reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0)}{' '}
            원
          </span>
        </p>
      </div>
    </main>
  );
};

export default App;
