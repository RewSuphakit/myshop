import React from "react";

const About = () => {
    return (
        <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">About Us</h1>
                    <p className="font-normal text-base leading-6 text-gray-600 ">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.In the first place we have granted to God, and by this our present charter confirmed for us and our heirs forever that the English Church shall be free, and shall have her rights entire, and her liberties inviolate; and we will that it be thus observed; which is apparent from</p>
                </div>
                <div className="w-full lg:w-8/12 ">
                    <img className="w-full h-full" src="https://scontent.fkkc2-1.fna.fbcdn.net/v/t1.15752-9/423568700_398415449435329_5771360547685350752_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeG7ruRtU54ebd5PpdpmWTy6KBvQkx3DSJgoG9CTHcNImJ5VbLPnwdLdimJykaoRCbvdwUizxW6chJo2eUdZCiQG&_nc_ohc=c8zkcXF0rwAAX_sb0NN&_nc_ht=scontent.fkkc2-1.fna&oh=03_AdTZFfl3meLf1gFUXNDlLuRPBXl15K3zggjJ65HHkod5Ig&oe=6608C49A" alt="A group of People" />
                </div>
            </div>

            <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">Our Story</h1>
                    <p className="font-normal text-base leading-6 text-gray-600 ">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.In the first place we have granted to God, and by this our present charter confirmed for us and our heirs forever that the English Church shall be free, and shall have her rights entire, and her liberties inviolate; and we will that it be thus observed; which is apparent from</p>
                </div>
                <div className="w-full lg:w-8/12 lg:pt-8">
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
                        <div className="p-4 pb-6 flex justify-center flex-col items-center">
                            <img className="md:block hidden" src="https://scontent.fkkc2-1.fna.fbcdn.net/v/t39.30808-6/284691342_1668697256824148_6402032171998937775_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeFvKnuOwR0t-gSHOPVufakE82cBJobfCBzzZwEmht8IHH0mIMxfKN5CUg1Jr8yegY6u-ssXepoqGSiWNOPBtsDR&_nc_ohc=4ZPXCtP1Jr8AX_nNaWl&_nc_ht=scontent.fkkc2-1.fna&oh=00_AfCMBwgoIOt51RqhllUeVU4oqZ3q28qnHgi88z_K_EvBJw&oe=65E6DB9B" alt="Alexa featured Img" />
                            <img className="md:hidden block" src="https://scontent.fkkc2-1.fna.fbcdn.net/v/t39.30808-6/284691342_1668697256824148_6402032171998937775_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeFvKnuOwR0t-gSHOPVufakE82cBJobfCBzzZwEmht8IHH0mIMxfKN5CUg1Jr8yegY6u-ssXepoqGSiWNOPBtsDR&_nc_ohc=4ZPXCtP1Jr8AX_nNaWl&_nc_ht=scontent.fkkc2-1.fna&oh=00_AfCMBwgoIOt51RqhllUeVU4oqZ3q28qnHgi88z_K_EvBJw&oe=65E6DB9B" alt="Alexa featured Img" />
                            <p className="font-medium text-xl leading-5 text-gray-800 mt-4">REW</p>
                        </div>
                     
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
