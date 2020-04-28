import React, { useContext } from "react";

import { Formik } from "formik";
import { Form } from "react-bootstrap";

import {
  Web3ConnectContext,
  CurrentUserContext,
  ContractContext
} from "../contexts/Store";

import { DepositSchema } from "./Validation";
import { CONTAINER, DEPOSITFORM, BUTTON } from "./Form.styled";

export const DepositForm = () => {
  const [web3Connect] = useContext(Web3ConnectContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [contracts] = useContext(ContractContext);

  return (
    <CONTAINER className="Card">
      <h2>Zip sETH LP</h2>
      <Formik
        initialValues={{
          amount: 0
        }}
        validationSchema={DepositSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            // 18 decimals
            const decimalValue = web3Connect.web3.utils.toWei("" + values.amount);
            await contracts.zuni.methods
              .stakeMyShare(decimalValue)
              .send({ from: currentUser.username });
            setCurrentUser({
              ...currentUser,
              ...{ wethBalance: +currentUser.wethBalance + values.amount }
            });
          } catch (err) {
            console.log(err);
          } finally {
            setSubmitting(false);
            resetForm();
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
          <DEPOSITFORM onSubmit={handleSubmit} className="mx-auto Form">
            <Form.Group controlId="depositForm">
              <Form.Label>Amount max:{currentUser.lpBalance}</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder="Amount to wrap"
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.amount && errors.amount ? "error" : null}
              />
              {touched.amount && errors.amount ? (
                <div className="error-message">{errors.amount}</div>
              ) : null}
            </Form.Group>
            <BUTTON type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading…" : "Submit"}
            </BUTTON>
          </DEPOSITFORM>
        )}
      </Formik>
    </CONTAINER>
  );
};
