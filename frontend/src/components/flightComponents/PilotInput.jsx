/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react/prop-types */
import {
  FormControl,
  GridItem,
  Input,
  Select,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5051";

const PilotInput = ({ inputs, setInputs, pilotNumber }) => {
  const [pilotos, setPilotos] = useState([]);
  const [name, setName] = useState([]);
  const [nip, setNip] = useState("");

  const getSavedPilots = async () => {
    try {
      const res = await axios.get(`${API_URL}/pilots`);
      // console.log(res);
      setPilotos(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSavedPilots();
  }, []);

  const [pilot, setPilot] = useState({
    nip: "",
    name: "",
  });

  const handleNipForm = (name) => {
    console.log(name);
    let temp = pilotos.filter((piloto) => piloto.name == name);
    // console.log(temp[0].nip);
    setNip(temp[0].nip);
    return temp[0].nip;
  };

  const handlePositionSelect = (e) => {
    e.preventDefault();
    if (e.target.value === "PC") {
      setName(pilotos.filter((piloto) => piloto.position == "PC"));
      setPilot({
        ...pilot,
        position: "PC",
      });
      let newpilot = { ...pilot, position: "PC" };
      let newinput = { ...inputs, [pilotNumber]: newpilot };
      setInputs(newinput);
    }
  };
  return (
    <GridItem colSpan={9}>
      <Flex flexDirection={"row"} mt={2}>
        <FormControl mx={1} isReadOnly alignSelf={"center"}>
          <Input
            // border="1px"
            // borderColor="gray"
            // borderRadius="5px"
            textAlign={"center"}
            value={nip}
          >
            {/* {!!nip ? nip : "-"} */}
          </Input>
        </FormControl>
        <FormControl mx={1}>
          <Select
            name="name"
            type="text"
            onChange={(e) => {
              console.log(e);
              console.log(e.target.value);
              let nip = handleNipForm(e.target.value);
              setPilot({
                ...pilot,
                name: e.target.value,
                nip: nip,
              });
              let newpilot = { ...pilot, name: e.target.value, nip: nip };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          >
            <option value=""> </option>
            {name.map((cat, i) => {
              return (
                <option key={i} value={cat.name}>
                  {cat.name}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <FormControl mx={1}>
          <Select
            name="posição"
            placeholder=" "
            type="text"
            onChange={handlePositionSelect}
          >
            <option value="PC">PC</option>
            <option value="CP">CP</option>
            <option value="OC">OC</option>
          </Select>
        </FormControl>
        <FormControl mx={1}>
          <Input
            name="ATR"
            type="number"
            onChange={(e) => {
              setPilot({
                ...pilot,
                ATR: e.target.value,
              });
              let newpilot = { ...pilot, ATR: e.target.value };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          />
        </FormControl>
        <FormControl mx={1}>
          <Input
            name="ATN"
            type="number"
            onChange={(e) => {
              setPilot({
                ...pilot,
                ATN: e.target.value,
              });

              let newpilot = { ...pilot, ATN: e.target.value };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          />
        </FormControl>
        <FormControl mx={1}>
          <Input
            name="PrecApp"
            type="number"
            onChange={(e) => {
              setPilot({
                ...pilot,
                precapp: e.target.value,
              });
              let newpilot = { ...pilot, precapp: e.target.value };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          />
        </FormControl>
        <FormControl mx={1}>
          <Input
            name="NPrecApp"
            type="number"
            onChange={(e) => {
              setPilot({
                ...pilot,
                nprecapp: e.target.value,
              });
              let newpilot = { ...pilot, nprecapp: e.target.value };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          />
        </FormControl>
        <FormControl mx={1}>
          <Select
            name="Qual1"
            placeholder=" "
            type="text"
            onChange={(e) => {
              setPilot({
                ...pilot,
                [e.target.value]: e.target.value,
              });
              let newpilot = { ...pilot, [e.target.value]: e.target.value };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          >
            <option value="QA1">QA1</option>
            <option value="QA2">QA2</option>
            <option value="BSP1">BSP1</option>
            <option value="BSP2">BSP2</option>
            <option value="TA">TA</option>
            <option value="VRP1">VRP1</option>
            <option value="VRP2">VRP2</option>
          </Select>
        </FormControl>
        <FormControl mx={1}>
          <Select
            name="Qual2"
            placeholder=" "
            type="text"
            onChange={(e) => {
              setPilot({
                ...pilot,
                [e.target.value]: e.target.value,
              });
              let newpilot = { ...pilot, [e.target.value]: e.target.value };
              let newinput = { ...inputs, [pilotNumber]: newpilot };
              setInputs(newinput);
            }}
          >
            <option value="QA1">QA1</option>
            <option value="QA2">QA2</option>
            <option value="BSP1">BSP1</option>
            <option value="BSP2">BSP2</option>
            <option value="TA">TA</option>
            <option value="VRP1">VRP1</option>
            <option value="VRP2">VRP2</option>
          </Select>
        </FormControl>
      </Flex>
    </GridItem>
  );
};

export default PilotInput;
