import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList,StyleSheet, Modal,Button } from 'react-native';
import { Card, Icon, Input } from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import { postFavorite, postComment} from '../redux/ActionCreators';
import {Rating } from 'react-native-elements';

const mapStateToProps = state => {
    return{
        dishes:state.dishes,
        comments:state.comments,
        favorites:state.favorites,
        showModal:state.showModal
    }
} 

const mapDispatchToProps = dispatch => ({
    postFavorite:(dishId) =>dispatch(postFavorite(dishId)),
    postComment:(dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});


function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.iconAlign}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o' }
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()} />
                        <Icon 
                            raised
                            reverse
                            name={'pencil'}
                            type= 'font-awesome'
                            color='#512DA8'
                            onPress={() => props.open()}
                        />
                    </View>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={12} readonly startingValue={item.rating} style={styles.rat} />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
 //          keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {

    constructor(props){
        super(props);
        this.state={
            showModal: false,
            rating: 4,
            author:'',
            comment:''
        }
    }

    toggleModal(){
        this.setState({showModal: !this.state.showModal});
    }


    handleComment(dishId){
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment);
    }   

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

 /*   setRating(rating) {
        this.setState({rating})
    }

    setAuthor(author) {
        this.setState({author})
    }

    setComment(comment) {
        this.setState({comment})
    } */


    static navigationOptions ={
        title: 'Dish Details'
    }; 


    render(){
        const dishId = this.props.navigation.getParam('dishId', '');

        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite= {this.props.favorites.some(el=>el ===dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    open={() =>this.toggleModal() }                                                                                       // put the + sign will turn the string into number.
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}  />       
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal()}}
                    onRequestClose={() => {this.toggleModal()}}
                    >
                    <View style={styles.modal}>
                        <Rating showRating fractions="{1}" startingValue="{5}" onFinishRating={(rating) =>this.setState({rating: rating})} />
                        <Input 
                            placeholder="Author"
                            leftIcon={
                                <Icon type='font-awesome' name='user-o' />
                            }
                            onChangeText={(value) => this.setState({author: value})}
                            />
                        <Input 
                            placeholder="Comment"
                            leftIcon={
                                <Icon type='font-awesome' name='comment-o' />
                            }
                            onChangeText={(value) => this.setState({comment: value})}
                            />
                    </View>
                    <View style={styles.modalButton}>
                        <Button 
                            onPress ={() => {this.handleComment(dishId)}}
                            color = "#512DA8"
                            title="SUBMIT"
                            />
                    </View>
                    <View style={styles.modalButton}>
                        <Button
                            onPress ={() =>{this.toggleModal()}}
                            color="#989898"
                            title="CANCEL"
                            />
                    </View>
                </Modal>
            </ScrollView>
        );                                                              
    }
}

const styles = StyleSheet.create({
    iconAlign: {
        flex:1,
        flexDirection: "row",
        justifyContent:"center"
    },
    modal: {
        justifyContent: "center",
        margin: 15
    },
    modalButton:{
        margin:12
    },
    rat: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        margin: 5
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);