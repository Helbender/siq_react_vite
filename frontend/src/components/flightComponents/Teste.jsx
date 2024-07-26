/* eslint-disable react/prop-types */
import { FormControl, FormLabel, Input, Flex, Select } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Teste = ({ inputs, setInputs }) => {
  const [pilotos, setPilotos] = useState([]);

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
  // const [pilot, setPilot] = React.useState({
  //   nip: "",
  //   name: "",
  // });
  return (
    <Flex gap={"2"}>
      <FormControl>
        <FormLabel>Nip</FormLabel>
        <Input
          type="number"
          // onChange={(e) => {
          //   setPilot({
          //     ...pilot,
          //     nip: e.target.value,
          //   });
          //   setInputs({ ...inputs, pilots: pilot });
          // }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl>
        <FormLabel>Position</FormLabel>
        <Select placeholder=" " type="text">
          <option value="PC">PC</option>
          <option value="CP">CP</option>
          <option value="OC">OC</option>
        </Select>
      </FormControl>
    </Flex>
  );
};

export default Teste;
