import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'antd';
import SchemaForm from 'antd-schema-form';
import moment from 'moment';
import schema from './formSchema';
import { randomId } from '../../../utils/utils';
import { saveQqOption, getQQOptionById } from '../models/models';

/* 添加配置 */
function Add(props) {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const form = Form.useForm();
  const [formValue, setFormValue] = useState(undefined);

  // 获取数据并回填
  async function getDataById() {
    if (params.id) {
      const { result } = await dispatch(getQQOptionById({
        query: params.id
      }));

      setFormValue({
        $root: result.value
      });
    }
  }

  // 提交
  async function handleFormSubmit(form, value, keys) {
    await dispatch(saveQqOption({
      data: {
        id: params.id ?? randomId(30),
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        value: value.$root
      }
    }));
    navigate('/Options');
  }

  // 返回
  function handleCancelClick(form, keys) {
    navigate('/Options');
  }

  useEffect(function() {
    getDataById();
  }, []);

  return (
    <Fragment>
      <SchemaForm form={ form }
        json={ schema }
        value={ formValue }
        onOk={ handleFormSubmit }
        onCancel={ handleCancelClick }
      />
    </Fragment>
  );
}

export default Add;