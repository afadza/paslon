import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';


type Post = {
  id: number;
  title: string;
};


const fetchData = async () => {
  const response = await axios.get<Post[]>('http://localhost:3000/posts');
  return response.data;
};

const createPost = async (newPost: Partial<Post>) => {
  const response = await axios.post<Post>('http://localhost:3000/posts', newPost);
  return response.data;
};

const updatePost = async ({ id, updatedPost }: { id: number; updatedPost: Partial<Post> }) => {
  const response = await axios.put<Post>(`http://localhost:3000/posts/${id}`, updatedPost);
  return response.data;
};

const deletePost = async (id: number) => {
  const response = await axios.delete(`http://localhost:3000/posts/${id}`);
  return response.data;
};

function UseQueryTest() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Post[]>('posts', fetchData);

  const createMutation = useMutation(createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const updateMutation = useMutation(updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const deleteMutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    },
  });

  const handleCreate = async (newPost: Partial<Post>) => {
    await createMutation.mutateAsync(newPost);
  };

  const handleUpdate = async (id: number, updatedPost: Partial<Post>) => {
    await updateMutation.mutateAsync({ id, updatedPost });
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            {post.title} <button onClick={() => handleUpdate(post.id, { title: 'Updated Post' })}>Update</button>{' '}
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleCreate({ title: 'New Post' })}>Create New Post</button>
    </div>
  );
}

export default UseQueryTest;
