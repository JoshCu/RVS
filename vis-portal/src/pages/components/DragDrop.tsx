import {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

interface GameStat {
  key: string;
  value: string | number;
  isNumerical: boolean;
}

interface Props {
  data: any[];
}

const DragAndDropComponent: React.FC<Props> = ({data}) => {
  const [categoricalStats, setCategoricalStats] = useState<GameStat[]>([]);
  const [numericalStats, setNumericalStats] = useState<GameStat[]>([]);

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(
      result.source.droppableId === "categorical"
        ? categoricalStats
        : numericalStats
    );

    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    if (result.destination.droppableId === "categorical") {
      setCategoricalStats(newItems);
    } else {
      setNumericalStats(newItems);
    }
  };

  const gameStats = data[0] || {};
  const allStats: GameStat[] = Object.entries(gameStats).map(([key, value]) => ({
    key: key,
    value: value as string | number,
    isNumerical: typeof value === "number",
  }));

  useEffect(() => {
    const categorical: GameStat[] = [];
    const numerical: GameStat[] = [];
    allStats.forEach((stat) => {
      if (stat.isNumerical) {
        numerical.push(stat);
      } else {
        categorical.push(stat);
      }
    });
    setCategoricalStats(categorical);
    setNumericalStats(numerical);
  }, [data]);

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div style={{display: "flex"}}>
        <Droppable droppableId="categorical">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{listStyleType: "none"}}
            >
              {categoricalStats.map((stat, index) => (
                <Draggable key={stat.key} draggableId={stat.key} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {stat.key}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        <Droppable droppableId="numerical">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{listStyleType: "none"}}
            >
              {numericalStats.map((stat, index) => (
                <Draggable key={stat.key} draggableId={stat.key} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {stat.key}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DragAndDropComponent;
