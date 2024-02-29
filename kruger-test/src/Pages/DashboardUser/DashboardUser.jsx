import {
  Card,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { getProfile, updateUser } from "../../bridges/ServiceBridge";
import ButtonCustom from "../../components/button/button";
import HeaderCustom from "../../components/header/header";
import "./DashboardUser.css";

const { Option } = Select;

const DashboardUser = () => {
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dateFormat = "YYYY/MM/DD";

  const onFinish = async (values) => {
    try {
      setConfirmLoading(true);
      const req = {
        userID: profile.key,
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        vaccinationStatus: values.vaccinationStatus,
        vaccineID:
          values.vaccine === profile.vaccine
            ? profile.vaccineID
            : values.vaccine,
        vaccineDate:
          moment(values.vaccineDate?.$d).format("YYYY/MM/DD") ===
          profile?.vaccineDate
            ? profile?.vaccineDate
            : moment(values.vaccineDate?.$d).format("YYYY/MM/DD"),
        numberOfDose: values.numberOfDose,
        dateOfBirth:
          moment(values.dateOfBirth?.$d).format("YYYY/MM/DD") ===
          profile?.dateOfBirth
            ? profile?.dateOfBirth
            : moment(values.dateOfBirth?.$d).format("YYYY/MM/DD"),
        address: values.address,
        phone: values.phone,
      };

      await updateUser(profile.employeeID, req);
      await getDataProfile();
    } catch (err) {
      console.error(err);
      message.error("Ha ocurrido un error al editar el usuario");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleVaccinationStatusChange = (e) => {
    setIsVaccinated(e.target.value);
  };

  const getDataProfile = async () => {
    const loginInformation = JSON.parse(localStorage.getItem("profile"));

    const req = {
      username: loginInformation?.user?.DNI,
    };

    const profile = await getProfile(req);

    form.setFieldsValue({
      DNI: profile.user?.DNI,
      name: profile.user?.name,
      lastName: profile.user?.lastName,
      email: profile.user?.email,
      vaccinationStatus:
        profile.user?.vaccinationStatus === 1
          ? true
          : profile.user?.vaccinationStatus === 0
          ? false
          : null,
      vaccineType: profile.user?.vaccine,
      numberOfDose: profile.user?.numberOfDose,
      address: profile.user?.address,
      phone: profile.user?.phone,
      vaccine: profile.user?.vaccine,
      dateOfBirth: dayjs(profile.user?.dateOfBirth.split("T")[0], dateFormat),
      vaccineDate: dayjs(profile.user?.vaccineDate.split("T")[0], dateFormat),
    });

    setIsVaccinated(
      profile.user?.vaccinationStatus === 1
        ? true
        : profile.user?.vaccinationStatus === 0
        ? false
        : null
    );
    setProfile(profile.user);
  };

  useEffect(() => {
    if (!profile) {
      getDataProfile();
    }
  }, []);

  return (
    <div>
      <HeaderCustom />
      <Space align='center' className='space-container'>
        <Card className='form-container'>
          <Form
            form={form}
            layout='vertical'
            name='employee_form'
            onFinish={onFinish}
          >
            <Form.Item
              className='input-field'
              name='DNI'
              label='Cédula'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu cédula.",
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='name'
              label='Nombres'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tus nombres.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='lastName'
              label='Apellidos'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tus apellidos.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='email'
              label='Correo'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa tu correo.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='dateOfBirth'
              label='Fecha de Nacimiento'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la fecha de nacimiento.",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='address'
              label='Dirección de Domicilio'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la dirección de domicilio.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='phone'
              label='Teléfono Móvil'
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el teléfono móvil.",
                },
              ]}
            >
              <Input type='number' />
            </Form.Item>

            <Form.Item
              className='input-field'
              name='vaccinationStatus'
              label='Estado de Vacunación'
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona el estado de vacunación.",
                },
              ]}
            >
              <Radio.Group onChange={handleVaccinationStatusChange}>
                <Radio value={true}>Vacunado</Radio>
                <Radio value={false}>No Vacunado</Radio>
              </Radio.Group>
            </Form.Item>

            {isVaccinated && (
              <>
                <Form.Item
                  className='input-field'
                  name='vaccine'
                  label='Tipo de Vacuna'
                  rules={[
                    {
                      required: true,
                      message: "Por favor selecciona el tipo de vacuna.",
                    },
                  ]}
                >
                  <Select>
                    <Option value='1'>Sputnik</Option>
                    <Option value='2'>AstraZeneca</Option>
                    <Option value='3'>Pfizer</Option>
                    <Option value='4'>Jhonson & Jhonson</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  className='input-field'
                  name='vaccineDate'
                  label='Fecha de Vacunación'
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa la fecha de vacunación.",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  className='input-field'
                  name='numberOfDose'
                  label='Número de Dosis'
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingresa el número de dosis.",
                    },
                  ]}
                >
                  <Input type='number' min={1} />
                </Form.Item>
              </>
            )}

            <Form.Item>
              {confirmLoading ? (
                <Spin />
              ) : (
                <ButtonCustom
                  type='primary'
                  htmlType='submit'
                  text='Actualizar'
                />
              )}
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default DashboardUser;
