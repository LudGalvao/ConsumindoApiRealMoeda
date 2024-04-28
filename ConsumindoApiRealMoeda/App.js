import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import axios from 'axios';

const App = () => {
  const [valorReal, setValorReal] = useState(''); // Estado para armazenar o valor em Real
  const [dadosMoeda, setDadosMoeda] = useState(null); // Estado para armazenar os dados da moeda
  const [erro, setErro] = useState(''); // Estado para armazenar mensagens de erro
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal

  const buscarConversao = async () => {
    try {
      const response = await axios.get(`https://economia.awesomeapi.com.br/json/all/USD-BRL`);
      if (response.data && valorReal) {
        const cotacaoDolar = response.data.USD.high;
        const valorConvertido = parseFloat(valorReal) / parseFloat(cotacaoDolar);
        setDadosMoeda({ valorConvertido }); // Define o valor convertido
        setErro('');
        setModalVisible(true); // Mostra o modal com o valor convertido
      } else {
        setDadosMoeda(null);
        setErro('Insira um valor em Real para converter.');
      }
    } catch (error) {
      console.error('Erro ao buscar moeda:', error);
      setDadosMoeda(null);
      setErro('Erro ao buscar a moeda. Verifique sua conexão ou tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversor de Moeda</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o valor em Real"
        value={valorReal}
        onChangeText={text => setValorReal(text)}
        keyboardType="numeric"
      />
      <Button
        title="Converter BRL -> USD"
        onPress={buscarConversao}
      />
      {erro ? <Text style={styles.error}>{erro}</Text> : null}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.moedaContainer}>
            <Text style={styles.nome}>Dólar Americano (USD)</Text>
            <Text style={styles.valor}>Valor Convertido: ${dadosMoeda?.valorConvertido.toFixed(2)}</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  moedaContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  valor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default App;
