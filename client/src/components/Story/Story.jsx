import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./Story.module.scss";

export const stories = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "https://i.pravatar.cc/150?img=1",
        background: "https://source.unsplash.com/random/300x500?nature",
    },
    {
        id: 2,
        name: "Trần Thị B",
        avatar: "https://i.pravatar.cc/150?img=2",
        background: "https://source.unsplash.com/random/300x500?city",
    },
    {
        id: 3,
        name: "Phạm Văn C",
        avatar: "https://i.pravatar.cc/150?img=3",
        background: "https://source.unsplash.com/random/300x500?ocean",
    },
    {
        id: 4,
        name: "Lê Thị D",
        avatar: "https://i.pravatar.cc/150?img=4",
        background: "https://source.unsplash.com/random/300x500?forest",
    },
];

function Story() {
    const router = useNavigate();

    return (
        <div className={styles.storyReel}>
            <div
                onClick={() => {
                    router("/stories/create");
                }}
                className={styles.story}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={
                        "https://sme.hust.edu.vn/wp-content/uploads/2022/02/Avatar-Facebook-trang.jpg"
                    }
                    alt="avatar"
                    className={styles.avatar_me}
                />
                <div
                    style={{
                        position: "relative",
                        minHeight: 28,
                        padding: "16px 0",
                    }}
                >
                    <button
                        style={{
                            border: "2px solid #fff",
                            top: -20,
                            left: "50%",
                            transform: "translateX(-50%)",
                            position: "absolute",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#0866ff",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <svg
                            viewBox="0 0 20 20"
                            width="20"
                            height="20"
                            fill="currentColor"
                            class="xfx01vb x1lliihq x1tzjh5l x1k90msu x2h7rmj x1qfuztq"
                        >
                            <g
                                fill-rule="evenodd"
                                transform="translate(-446 -350)"
                            >
                                <g fill-rule="nonzero">
                                    <path
                                        d="M95 201.5h13a1 1 0 1 0 0-2H95a1 1 0 1 0 0 2z"
                                        transform="translate(354.5 159.5)"
                                    ></path>
                                    <path
                                        d="M102.5 207v-13a1 1 0 1 0-2 0v13a1 1 0 1 0 2 0z"
                                        transform="translate(354.5 159.5)"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                    </button>
                    <p
                        style={{
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    >
                        Tạo tin
                    </p>
                </div>
            </div>
            {stories.map((story) => (
                <div
                    key={story.id}
                    className={styles.story}
                    style={{ backgroundImage: `url(${story.background})` }}
                    onClick={() => {
                        router(`/stories/view/${story.id}`);
                    }}
                >
                    <Avatar src={story.avatar} className={styles.avatar} />
                    <h4>{story.name}</h4>
                </div>
            ))}
        </div>
    );
}

export default Story;