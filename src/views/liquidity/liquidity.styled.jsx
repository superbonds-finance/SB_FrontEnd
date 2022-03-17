import styled from 'styled-components';

export const HeaderText=styled.span`
    font-family: Archivo;
    font-style: normal;
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    letter-spacing: 0.146643px;
    text-transform: uppercase;
    color: #FFFFFF;
`
export const Text=styled.span`
font-family: Archivo;
font-style: normal;
font-weight: 500;
font-size: ${(props) => (props.size ? props.size : '14px')};
line-height: 22px;
text-transform: ${(props) => (props.transform ? "uppercase" : 'non')};
letter-spacing:1px;
color: ${(props) => (props.color ? props.color : '#FFFFFF')};
opacity: ${(props) => (props.opacity ? props.opacity : '')};

@media (max-width: 639px) {
    font-size: 12px;
}
`
export const ButtonText=styled.span`
font-family: Archivo;
font-style: normal;
font-weight: ${(props) => (props.weight ?  'bold' : '')};
font-size: ${(props) => (props.size ? props.size : '14px')};
line-height: 22px;
text-transform: ${(props) => (props.transform ? "uppercase" : 'non')};
opacity: ${(props) => (props.opacity ? props.opacity : '')};
hover:color
`