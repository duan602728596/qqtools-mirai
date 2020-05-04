import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Tabs } from 'antd';
import SchemaForm from 'antd-schema-form/es/SchemaForm';
import {
  defaultString,
  defaultNumber,
  defaultBoolean,
  defaultObject,
  defaultArray,
  textArea,
  switchComponent
} from 'antd-schema-form/es/components/custom/custom';
import moment from 'moment';
import style from './add.sass';
import schema from './formSchema';
import { randomId } from '../../../utils/utils';
import { saveQqOption, getQQOptionById } from '../models/models';
import BilibiliLiveIdSearch from './BilibiliLiveIdSearch';

/* 添加配置 */
function Add(props) {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
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
    <div className={ style.main }>
      <div className={ style.schemaForm }>
        <SchemaForm json={ schema }
          value={ formValue }
          onOk={ handleFormSubmit }
          onCancel={ handleCancelClick }
          customComponent={{
            defaultString,
            defaultNumber,
            defaultBoolean,
            defaultObject,
            defaultArray,
            textArea,
            switch: switchComponent
          }}
        />
      </div>
      <div className={ style.help }>
        <h3>帮助工具</h3>
        <Divider />
        <Tabs size="small" type="card" tabPosition="right">
          <Tabs.TabPane key="bilibiliLiveIdSearch"
            tab={
              <span className={ style.smallTitle }>
                B站直播
                <br />
                间ID查询
              </span>
            }
          >
            <BilibiliLiveIdSearch />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Add;