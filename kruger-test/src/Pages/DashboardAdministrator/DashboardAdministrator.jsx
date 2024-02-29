import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../../bridges/ServiceBridge";
import ButtonCustom from "../../components/button/button";
import HeaderCustom from "../../components/header/header";
import ModalComponent from "../../components/modal/modal";
import "./DashboardAdministrator.css";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DashboardAdministrator = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [cedulaError, setCedulaError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [recordSelected, setRecordSelected] = useState(null);

  const dateFormat = "YYYY/MM/DD";

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
    },
    {
      title: "Apellido",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortOrder: sortedInfo.columnKey === "lastName" ? sortedInfo.order : null,
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      render: (text) => <span>{text || "Sin información"}</span>,
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      sorter: (a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth),
      sortOrder:
        sortedInfo.columnKey === "dateOfBirth" ? sortedInfo.order : null,
      render: (text) => <span>{text?.split("T")[0] || "Sin información"}</span>,
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone - b.phone,
      sortOrder: sortedInfo.columnKey === "phone" ? sortedInfo.order : null,
      render: (text) => <span>{text || "Sin información"}</span>,
    },
    {
      title: "Estado de Vacunación",
      dataIndex: "vaccinationStatusText",
      key: "vaccinationStatusText",
      filters: [
        { text: "Vacunado", value: "Vacunado" },
        { text: "No Vacunado", value: "No Vacunado" },
        { text: "Sin información", value: "Sin información" },
      ],
      filteredValue: filteredInfo.vaccinationStatusText || null,
      onFilter: (value, record) =>
        record.vaccinationStatusText &&
        record.vaccinationStatusText.includes(value),
      sorter: (a, b) =>
        a.vaccinationStatusText.length - b.vaccinationStatusText.length,
      sortOrder:
        sortedInfo.columnKey === "vaccinationStatusText"
          ? sortedInfo.order
          : null,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Estado de Vacunación",
      dataIndex: "vaccinationStatus",
      key: "vaccinationStatus",
      hidden: true,
    },
    {
      title: "Vacuna",
      dataIndex: "vaccine",
      key: "vaccine",
      filters: [
        { text: "Sputnik", value: "Sputnik" },
        { text: "AstraZeneca", value: "AstraZeneca" },
        { text: "Pfizer", value: "Pfizer" },
        { text: "Jhonson&Jhonson", value: "Jhonson&Jhonson" },
        { text: "Sin información", value: "Sin información" },
      ],
      filteredValue: filteredInfo?.vaccine || null,
      onFilter: (value, record) =>
        record?.vaccine && record?.vaccine.includes(value),
      sorter: (a, b) => a?.vaccine.length - b?.vaccine.length,
      sortOrder: sortedInfo.columnKey === "vaccine" ? sortedInfo.order : null,
      render: (text) => <span>{text || "Sin información"}</span>,
    },
    {
      title: "Fecha de Vacunación",
      dataIndex: "vaccineDate",
      key: "vaccineDate",
      filters: [],
      filteredValue: filteredInfo.dateRange
        ? [filteredInfo.dateRange.startDate, filteredInfo.dateRange.endDate]
        : null,
      onFilter: (value, record) => {
        const { vaccineDate } = record;
        const { startDate, endDate } = filteredInfo.dateRange;
        return moment(vaccineDate).isBetween(
          moment(startDate.$d),
          moment(endDate.$d),
          null,
          "[]"
        );
      },
      sorter: (a, b) => a.vaccineDate.localeCompare(b.vaccineDate),
      sortOrder:
        sortedInfo.columnKey === "vaccineDate" ? sortedInfo.order : null,
      render: (text) => <span>{text?.split("T")[0] || "Sin información"}</span>,
    },
    {
      title: "Número de Dosis",
      dataIndex: "numberOfDose",
      key: "numberOfDose",
      sorter: (a, b) => a.numberOfDose - b.numberOfDose,
      sortOrder:
        sortedInfo.columnKey === "numberOfDose" ? sortedInfo.order : null,
      render: (text) => <span>{text || "Sin información"}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size='middle'>
          <Button
            text='Editar'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            text='Eliminar'
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const makeTable = () => {
    const tempTable = allUsers.map((user) => {
      return {
        key: user.userID,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        phone: user.phone,
        vaccinationStatus: user.vaccinationStatus,
        vaccinationStatusText: user.vaccinationStatusText,
        vaccine: user.vaccine,
        vaccineDate: user.vaccineDate,
        numberOfDose: user.numberOfDose,
      };
    });

    setDataTable(tempTable);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    formEdit.resetFields();
    form.resetFields();
    setRecordSelected(null);
    setOpen(false);
    setOpenEdit(false);
  };

  const handleEdit = (record) => {
    formEdit.setFieldsValue({
      name: record?.name,
      lastName: record?.lastName,
      email: record?.email,
      vaccinationStatus: record?.vaccinationStatus,
      vaccineType: record?.vaccine,
      numberOfDose: record?.numberOfDose,
      address: record?.address,
      phone: record?.phone,
      vaccine: record?.vaccine,
      vaccineDate: dayjs(record?.vaccineDate, dateFormat),
      dateOfBirth: dayjs(record?.dateOfBirth, dateFormat),
    });
    setOpenEdit(true);
    setRecordSelected(() => record);
  };

  const handleDelete = async (record) => {
    await deleteUser(record.key);
    getDataUsers();
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFilteredInfo({
        ...filteredInfo,
        dateRange: {
          startDate: dates[0].startOf("day"),
          endDate: dates[1].endOf("day"),
        },
      });
    } else {
      setFilteredInfo({
        ...filteredInfo,
        dateRange: null,
      });
    }
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setSortedInfo({});
  };

  const onSearch = (value) => {
    if (!value || value === "") {
      getDataUsers();
      return;
    }

    const filteredData = dataTable.filter((item) => {
      return (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.lastName.toLowerCase().includes(value.toLowerCase())
      );
    });

    setDataTable(filteredData);
  };

  const validateCedula = (_, value) => {
    if (!value || /^[0-9]{10}$/.test(value)) {
      setCedulaError("");
      return Promise.resolve();
    }
    setCedulaError("¡Por favor ingresa una cédula válida de 10 dígitos!");
    return Promise.reject(
      "¡Por favor ingresa una cédula válida de 10 dígitos!"
    );
  };

  const validateEmail = (_, value) => {
    if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("");
      return Promise.resolve();
    }
    setEmailError("¡Por favor ingresa un correo electrónico válido!");
    return Promise.reject("¡Por favor ingresa un correo electrónico válido!");
  };

  const onFinish = async (values) => {
    setConfirmLoading(true);
    const req = {
      DNI: values.cedula,
      password: values.cedula,
      name: values.nombres,
      lastName: values.apellidos,
      email: values.email,
    };

    form.resetFields();

    await createUser(req);
    getDataUsers();

    setOpen(false);
    setConfirmLoading(false);
  };

  const onFinishEdit = async (values) => {
    try {
      setConfirmLoading(true);
      const req = {
        userID: recordSelected.key,
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        vaccinationStatus: values.vaccinationStatus,
        vaccineID:
          values.vaccine === recordSelected.vaccine
            ? recordSelected.vaccineID
            : values.vaccine,
        vaccineDate:
          moment(values.vaccineDate?.$d).format("YYYY/MM/DD") ===
          recordSelected?.vaccineDate
            ? recordSelected?.vaccineDate
            : moment(values.vaccineDate?.$d).format("YYYY/MM/DD"),
        numberOfDose: values.numberOfDose,
        dateOfBirth:
          moment(values.dateOfBirth?.$d).format("YYYY/MM/DD") ===
          recordSelected?.dateOfBirth
            ? recordSelected?.dateOfBirth
            : moment(values.dateOfBirth?.$d).format("YYYY/MM/DD"),
        address: values.address,
        phone: values.phone,
      };

      await updateUser(req.userID, req);
      setRecordSelected(null);
      await getDataUsers();
      setOpenEdit(false);
      formEdit.resetFields();
      setConfirmLoading(false);
    } catch (err) {
      console.error(err);
      message.error("Ha ocurrido un error al editar el usuario");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleVaccinationStatusChange = (e) => {
    setRecordSelected({
      ...recordSelected,
      vaccinationStatus: e.target.value,
    });
  };

  const getDataUsers = async () => {
    const users = await getAllUsers();
    form.resetFields();
    formEdit.resetFields();
    setRecordSelected(null);
    setAllUsers(users.data);
  };

  useEffect(() => {
    if (allUsers.length === 0) {
      getDataUsers();
    }
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      makeTable();
    }
  }, [allUsers]);

  useEffect(() => {
    if (!recordSelected) {
      formEdit.resetFields();
      formEdit.setFieldsValue({});

      form.resetFields();
      form.setFieldsValue({});
    }
  }, [recordSelected]);

  return (
    <>
      <div>
        <HeaderCustom />
        <div className='container'>
          <Space direction='vertical'>
            <Tooltip title='Presiona Enter para buscar' color={"#ff9016"}>
              <Search
                placeholder='Buscar por nombre'
                onSearch={onSearch}
                className='search-input'
              />
            </Tooltip>
            <div>
              <ButtonCustom onClick={clearFilters} text='Restablecer filtros' />
              <ButtonCustom onClick={clearAll} text='Restablecer orden' />
              <ButtonCustom
                onClick={showModal}
                text='Agregar nuevo empleado'
                icon={<UserAddOutlined />}
              />
              <RangePicker onChange={handleDateRangeChange} />
            </div>
          </Space>
          <Table
            dataSource={dataTable}
            columns={columns}
            onChange={handleChange}
          />
        </div>
      </div>
      <ModalComponent
        open={open}
        confirmLoading={confirmLoading}
        handleOk={() => {
          form.validateFields().then((values) => {
            onFinish(values);
          });
        }}
        title='Agregar nuevo empleado'
        content={
          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            className='form-container'
          >
            <Form.Item
              className='form-item'
              label='Cédula'
              name='cedula'
              rules={[
                { required: true, message: "¡Por favor ingresa la cédula!" },
                { validator: validateCedula },
              ]}
              validateStatus={cedulaError ? "error" : ""}
              help={cedulaError}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='form-item'
              label='Nombres'
              name='nombres'
              rules={[
                { required: true, message: "¡Por favor ingresa los nombres!" },
                {
                  pattern: /^[a-zA-Z\s]+$/,
                  message:
                    "¡Los nombres no deben contener números o caracteres especiales!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='form-item'
              label='Apellidos'
              name='apellidos'
              rules={[
                {
                  required: true,
                  message: "¡Por favor ingresa los apellidos!",
                },
                {
                  pattern: /^[a-zA-Z\s]+$/,
                  message:
                    "¡Los apellidos no deben contener números o caracteres especiales!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className='form-item'
              label='Correo Electrónico'
              name='email'
              rules={[
                {
                  required: true,
                  message: "¡Por favor ingresa el correo electrónico!",
                },
                { validator: validateEmail },
              ]}
              validateStatus={emailError ? "error" : ""}
              help={emailError}
            >
              <Input />
            </Form.Item>
          </Form>
        }
        handleCancel={handleCancel}
      />
      <ModalComponent
        open={openEdit}
        confirmLoading={confirmLoading}
        handleOk={() => {
          formEdit.validateFields().then((values) => {
            onFinishEdit(values);
          });
        }}
        title='Editar empleado'
        content={
          <Form
            layout='vertical'
            name='employee_form'
            form={formEdit}
            onFinish={onFinishEdit}
            // initialValues={{
            //   name: recordSelected?.name,
            //   lastName: recordSelected?.lastName,
            //   email: recordSelected?.email,
            //   vaccinationStatus: recordSelected?.vaccinationStatus,
            //   vaccineType: recordSelected?.vaccine,
            //   numberOfDose: recordSelected?.numberOfDose,
            //   address: recordSelected?.address,
            //   phone: recordSelected?.phone,
            //   vaccine: recordSelected?.vaccine,
            //   vaccineDate: dayjs(recordSelected?.vaccineDate, dateFormat),
            //   dateOfBirth: dayjs(recordSelected?.dateOfBirth, dateFormat),
            // }}
          >
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
              <DatePicker
                style={{ width: "100%" }}
                format={dateFormat}
                defaultValue={dayjs(
                  recordSelected?.dateOfBirth.split("T")[0],
                  dateFormat
                )}
              />
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
              <Input />
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

            {recordSelected?.vaccinationStatus && (
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
                  <DatePicker
                    style={{ width: "100%" }}
                    format={dateFormat}
                    defaultValue={dayjs(
                      recordSelected?.vaccineDate.split("T")[0],
                      dateFormat
                    )}
                  />
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
          </Form>
        }
        handleCancel={handleCancel}
      />
    </>
  );
};

export default DashboardAdministrator;
