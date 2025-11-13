const CharacterAvatar = ({ avatar, alt, sm }) => {
    return (
        <img
            className={`${
                sm ? "h-10 w-10" : "h-[42px] w-[42px] mr-3"
            } rounded-full flex-shrink-0 object-cover shadow-md`}
            src={avatar}
            alt={alt}
        />
    );
};

export default CharacterAvatar;
