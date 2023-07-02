import React from 'react'
import Card from '../../components/cards/Card'
import VertList from '../../components/common/VertList'
import Field from '../../components/elements/Field'
import Form from '../../components/elements/Form'

function Password() {
  return (
    <div>
        
        <Card>
          <Form header={"Change Password"} submitBtnTxt={"Save Changes"}>
            <div className="form-layouts form-layout-left">
              <Field type={"password"} placeholder={"Current Password"}/>
              <Field type={"password"} placeholder={"New Password"} />
              <Field type={"password"} placeholder={"Corfim Password"} />
            </div>
            <div className="form-layouts form-layout-right">
              <VertList>
                {/* <p>Make sure password is</p> */}
              </VertList>
              <br />
            </div>
          </Form>
        </Card>
    </div>
  )
}

export default Password
